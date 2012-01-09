var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var sqs = require("amazon/sqs");
var _ = require('underscore');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sqs = new sqs.Sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sqs.region() );
console.log( 'EndPoint :',  sqs.host() );
console.log( 'AccessKeyId :', sqs.accessKeyId() );
// console.log( 'SecretAccessKey :', sqs.secretAccessKey() );
console.log( 'AwsAccountId :', sqs.awsAccountId() );

var options = {
    QueueName : 'my-queue',
    MaxNumberOfMessages : 5,
};

sqs.ReceiveMessage(options, function(err, data) {
    var receiptHandles = [];
    var visibilityTimeouts = [];

    console.log("\nReceiving message from my-queue - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');

    // if there wasn't an error, delete these messages in one hit
    if ( ! err ) {
        // make sure we have some messages to delete
        if ( _.isUndefined(data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message) ) {
            console.log("\nNo messages to change visibility of");
            return;
        }

        if ( ! _.isArray(data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message) ) {
            // turn this into an array
            data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message = [
                data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message
            ];
        }

        var batchOptions = {
            QueueName         : 'my-queue',
            Id                : [],
            ReceiptHandle     : [],
            VisibilityTimeout : [],
        };

        _.each(data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message, function(m) {
            batchOptions.Id.push( 'id-' + Math.floor(Math.random() * 1000) );
            batchOptions.ReceiptHandle.push(m.ReceiptHandle);
            batchOptions.VisibilityTimeout.push(10);
        });

        sqs.ChangeMessageVisibilityBatch(batchOptions, function(err, data) {
            console.log("\nChanging visibility batch - expecting success");
            inspect(err, 'Error');
            inspect(data, 'Data');
        });
    }
});
