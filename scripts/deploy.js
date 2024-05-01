const hre = require("hardhat");

async function main() {
    const Handle = await hre.ethers.getContractFactory("HandleRegistry");
    const handle = await Handle.deploy();

    console.log("Deployed address: ", handle.runner.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
