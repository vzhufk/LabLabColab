import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export class Tables extends cdk.NestedStack {
  public readonly mainTable: DatabaseInstance;
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'VPC');

    this.mainTable = new DatabaseInstance(this, 'MyDatabase', {
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_15_4 }),
      instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
      vpc,
      allocatedStorage: 10,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
