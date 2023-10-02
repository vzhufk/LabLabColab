import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPoolStack } from './user-pool';
import { LambdasStack } from './lambdas';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPoolStack(this, 'CognitoStack');
    const lambdas = new LambdasStack(this, 'LambdasStack');
  }
}
