import getApi, { disconnect } from "./api";
import testKeyring from "@polkadot/keyring/testing"
import { newBounty } from "./utils";
import { ss58Format } from "./constants";
import { encodeAddress } from "@polkadot/keyring"

async function createBounty() {
  const api = await getApi()

  const keyring = testKeyring()
  keyring.setSS58Format(ss58Format)
  const alice = keyring.pairs[0]

  const bounty = newBounty(
    '2gPoCn9m6RngxZjvc1jnznbPGVVEoevHUCJ7CctYm3oebgnh',
    1000 * Math.pow(10, 8),
    '0xa45dd837a0d608ddde47f32c8d06a312e8aaa2a3ac4976600be918758c3b3eeb'
  )

  const unsub = await api.tx.osBounties.createBounty(bounty)
    .signAndSend(alice, async ({ events = [], status }) => {
      for (const e of events) {
        const { event } = e

        const method = event.method
        const data = event.data.toJSON()

        if ('ApplyBounty' === method) {
          // @ts-ignore
          const [accountId, bountyId] = data
          // @ts-ignore
          console.log(`${encodeAddress(accountId, ss58Format)} created bounty ${bountyId}`)
        }
      }

      if (status.isFinalized) {
        unsub()
        await disconnect()
      }
    })
}

createBounty()
