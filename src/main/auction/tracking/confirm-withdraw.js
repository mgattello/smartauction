//Wait for ~10 mins for Mumbai testnet or ~30mins for Ethereum Mainnet till the checkpoint is submitted for burned transaction, then run the confirm withdraw
const { getPlasmaClient, plasma } = require('../utils')

async function execute () {
  const plasmaClient = await getPlasmaClient()
  const erc20Token = plasmaClient.erc20(plasma.parent.erc20, true)
  const result = await erc20Token.withdrawConfirm("<burn tx hash>")

  const txHash = await result.getTransactionHash()
  const txReceipt = await result.getReceipt()
}

execute().then(_ => {
  process.exit(0)
})