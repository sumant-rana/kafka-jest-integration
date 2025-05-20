## Execution

1. Clone the repository
   ```sh
   git clone https://github.com/sumant-rana/kafka-jest-integration.git
   cd kafka-jest-integration
   ```
2. Install the dependencies
   ```sh
   npm install
   ```
3. Export environment variable to avoind showing some warning messages related to newer version of kafkajs
   ```sh
   export KAFKAJS_NO_PARTITIONER_WARNING=1
   ```
4. Run the test
   ```sh
   jest
   ```
   The output will contain an error `The group coordinator is not available`. This has been documented here [https://github.com/tulios/kafkajs/issues/1494](https://github.com/tulios/kafkajs/issues/1494). Ignore the error
   The test should pass.
   

