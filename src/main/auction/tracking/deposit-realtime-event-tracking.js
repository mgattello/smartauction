const WebSocket = require("ws");
const _ = require("lodash");

// For Mumbai
const ws = new WebSocket("wss://ws-mumbai.matic.today/");
// For Polygon mainnet: wss://ws-mainnet.matic.network/

async function checkDepositStatus(user, token, childChain) {
  return new Promise((resolve, reject) => {
    ws.on("open", function open() {
      ws.send(
        `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {"Contract": ${childChain}}]}`
      );
      ws.on("message", function incoming(data) {
        var txData = _.get(JSON.parse(data), "params.result.Data", "");
        var userAddress = txData.substring(0, 64).replace(/^0+/, "0x");
        var contractAddress = txData.substring(65, 128).replace(/^0+/, "0x");

        if (
          user &&
          user.toLowerCase() === userAddress.toLowerCase() &&
          token &&
          token.toLowerCase() === contractAddress.toLowerCase()
        ) {
          console.log(data);
          resolve(true); // eslint-disable-line
        }
      });

      ws.on("close", () => {
        reject(false);
      });

      ws.on("error", () => {
        reject(false);
      });
    });
  });
}

// Param1 - user address
// Param2 - contract address on main chain
// Param3 - child chain address (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861 for mainnet)
checkDepositStatus(
  "0xFd71Dc9721d9ddCF0480A582927c3dCd42f3064C",
  "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
  "0x1EDd419627Ef40736ec4f8ceffdE671a30803c5e"
)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });