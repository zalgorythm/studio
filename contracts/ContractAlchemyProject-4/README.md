# Timelock Contract

A smart contract that enforces a time-based release condition for assets.

## Description

The `Timelock` contract allows an owner to lock funds and release them to a beneficiary after a specified time has passed.  It ensures that the beneficiary can only claim the funds once the `releaseTime` is reached.  The owner can also withdraw any remaining funds after the initial release.

## Features

-   **Time-Based Release:** Funds are released to the beneficiary only after a pre-defined timestamp.
-   **Beneficiary Address:**  Specifies the address that will receive the funds upon release.
-   **Owner Control:** Only the owner can set the release time and withdraw remaining funds.
-   **Single Release:** Ensures funds are released only once.
