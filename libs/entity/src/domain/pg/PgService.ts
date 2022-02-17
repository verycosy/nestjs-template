export interface PgService {
  getPayment(merchantUid: string);
  cancelPayment(
    merchantUid: string,
    reason: string,
    checksum: number,
    cancelRequestAmount?: number,
  );
}
