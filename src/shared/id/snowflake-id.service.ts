import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as crypto from 'crypto';

@Injectable()
export class SnowFlakeIdService {
  private static instance: SnowFlakeIdService;

  private readonly twepoch = 1489111610226n;

  private readonly workerIdBits = 5n;

  private readonly dataCenterIdBits = 5n;

  private readonly sequenceBits = 12n;

  private readonly maxWorkerId = -1n ^ (-1n << this.workerIdBits);

  private readonly maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits);

  private readonly workerIdShift = this.sequenceBits;

  private readonly dataCenterIdShift = this.sequenceBits + this.workerIdBits;

  private readonly timestampLeftShift =
    this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

  private readonly sequenceMask = -1n ^ (-1n << this.sequenceBits);

  private workerId = 0n;

  private dataCenterId = 0n;

  private sequence = 0n;

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

  public setWorkerId(workerId: number): void {
    if (workerId < 0 || workerId > Number(this.maxWorkerId)) {
      throw new Error(`WorkerId phải nằm trong khoảng từ 0 đến ${this.maxWorkerId.toString()}`);
    }
    this.workerId = BigInt(workerId);
  }

  public setDataCenterId(dataCenterId: number): void {
    if (dataCenterId < 0 || dataCenterId > Number(this.maxDataCenterId)) {
      throw new Error(
        `Data Center ID không được lớn hơn ${this.maxDataCenterId.toString()} hoặc nhỏ hơn 0`,
      );
    }
    this.dataCenterId = BigInt(dataCenterId);
  }

  public nextId(): string {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${
          this.lastTimestamp - timestamp
        } milliseconds`,
      );
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

    return idBigInt.toString();
  }

  protected tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  protected timeGen(): bigint {
    return BigInt(Date.now());
  }

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

  private getDataCenterId(): number {
    const hostname = os.hostname();
    const sum = hostname
      .split('')
      .map(c => c.charCodeAt(0))
      .reduce((a, b) => a + b, 0);

    return sum % 32;
  }
}
