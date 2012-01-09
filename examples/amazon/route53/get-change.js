var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var route53 = require("amazon/route53");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var r53 = new route53.Route53(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', r53.region() );
console.log( 'EndPoint :',  r53.host() );
console.log( 'AccessKeyId :', r53.accessKeyId() );
// console.log( 'SecretAccessKey :', r53.secretAccessKey() );
console.log( 'AwsAccountId :', r53.awsAccountId() );

r53.GetChange({ ChangeId : 'cafebabe' }, function(err, data) {
    console.log("\ngetting change information - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
