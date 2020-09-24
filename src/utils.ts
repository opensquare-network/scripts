export function newBounty(owner: string, payment: number, digest: string) {
  return {
    V1: {
      owner,
      currencyId: {
        // @ts-ignore
        Native: null
      },
      payment,
      digest
    }
  }
}
