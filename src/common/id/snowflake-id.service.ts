import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as crypto from 'crypto';

@Injectable()
export class SnowFlakeIdService {
  private static instance: SnowFlakeIdService;

  // ============================== Config =================================
  /** Start time cut (2017-03-10) */
  private readonly twepoch = 1489111610226n;

  /** The number of bits in the machine id */
  private readonly workerIdBits = 5n;

  /** Number of digits in the data identifier id */
  private readonly dataCenterIdBits = 5n;

  /** The number of bits in the id of the sequence */
  private readonly sequenceBits = 2n;

  /** The maximum machine id supported */
  private readonly maxWorkerId = -1n ^ (-1n << this.workerIdBits);

  /** The maximum data ID id supported */
  private readonly maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits);

  /** Machine ID is shifted to the left by 5 bits */
  private readonly workerIdShift = this.sequenceBits;

  /** The data identification id is shifted to the left by 10 bits (5+5) */
  private readonly dataCenterIdShift = this.sequenceBits + this.workerIdBits;

  /** Time is shifted to the left by 15 bits (5+5+5) */
  private readonly timestampLeftShift =
    this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

  /** Generate a mask for the sequence */
  private readonly sequenceMask = -1n ^ (-1n << this.sequenceBits);

  /** Work Machine ID (0~31) */
  private workerId = 0n;

  /** Data Center ID (0~31) */
  private dataCenterId = 0n;

  /** Sequence within milliseconds (0~4095) */
  private sequence = 0n;

  /** Time to last generated ID */
  private lastTimestamp = -1n;

  private constructor() {
    this.workerId = BigInt(this.getWorkId());
    this.dataCenterId = BigInt(this.getDataCenterId());
  }

  public static getInstance(): SnowFlakeIdService {
    if (!this.instance) {
      this.instance = new SnowFlakeIdService();
    }
    return this.instance;
  }

  /** Set machine id (0~31) */
  public setNodeId(nodeId: number): void {
    if (nodeId < 0 || nodeId > Number(this.maxWorkerId)) {
      throw new Error(`NodeId must be between 0 and ${this.maxWorkerId.toString()}`);
    }
    this.workerId = BigInt(nodeId);
  }

  /** Set data center id (0~31) */
  public setDataCenterId(dataCenterId: number): void {
    if (dataCenterId < 0 || dataCenterId > Number(this.maxDataCenterId)) {
      throw new Error(
        `dataCenterId can't be greater than ${this.maxDataCenterId.toString()} or less than 0`,
      );
    }
    this.dataCenterId = BigInt(dataCenterId);
  }

  /**
   * Get the next ID (this method is thread safe)
   * @return SnowflakeId (as string)
   */
  public nextId(): number {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards!');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      if (this.sequence === 0n) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const idBigInt =
      ((timestamp - this.twepoch) << this.timestampLeftShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;

    return Number(idBigInt);
  }

  /** Block until next millisecond */
  protected tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  /** Returns the current time in milliseconds */
  protected timeGen(): bigint {
    return BigInt(Date.now());
  }

  /** Get workId based on IP hash */
  private getWorkId(): number {
    try {
      const networkInterfaces = os.networkInterfaces();
      const addresses: string[] = [];

      for (const key of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[key] || []) {
          if (net.family === 'IPv4' && !net.internal) {
            addresses.push(net.address);
          }
        }
      }

      const host = addresses[0] || '127.0.0.1';
      const sum = host
        .split('.')
        .map(x => parseInt(x))
        .reduce((a, b) => a + b, 0);

      return sum % 32;
    } catch {
      return crypto.randomInt(0, 31);
    }
  }

  /** Get dataCenterId based on hostname hash */
  private getDataCenterId(): number {
    const hostname = os.hostname();
    const sum = hostname
      .split('')
      .map(c => c.charCodeAt(0))
      .reduce((a, b) => a + b, 0);

    return sum % 32;
  }
}
