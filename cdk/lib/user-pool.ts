import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito'

export class UserPoolStack extends cdk.Stack {
  public userPool: UserPool;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, 'UserPool', {
      
    });
  }
}
