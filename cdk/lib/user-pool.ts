import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { CfnOutput } from 'aws-cdk-lib';

export class UserPoolStack extends cdk.Stack {
  public userPool: UserPool;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, 'UserPool', {
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: false,
      signInCaseSensitive: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      standardAttributes: {
        givenName: {
          mutable: true,
          required: true,
        },
        middleName: {
          mutable: true,
          required: false,
        },
        familyName: {
          mutable: true,
          required: true,
        }
      }
    });
    const client = this.userPool.addClient('web-client');

    new CfnOutput(this, 'userPoolId', {
      value: this.userPool.userPoolId,
    })

    new CfnOutput(this, 'userPoolClientId', {
      value: client.userPoolClientId,
    })
  }
}
