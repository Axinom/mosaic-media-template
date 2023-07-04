import { SMILEnvelope } from '../models';

export abstract class SmilGenerator<T> {
  abstract generate(originalEvent: T): SMILEnvelope;
}
