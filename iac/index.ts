import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2("my-bucket-ftr", {
    tags: {
        Name: "my-bucket-ftr",
        IAC: "true",
    },
});

const bucket2 = new aws.s3.BucketV2("my-bucket-ftr-2", {
    tags: {
        Name: "my-bucket-ftr-2",
        IAC: "true",
    },
});

// Export the name of the bucket
export const bucketName = bucket.id;
export const bucketName2 = bucket2.id;
