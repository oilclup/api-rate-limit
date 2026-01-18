terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket = "natthapong-terraform-state-bucket-12345"  
    key    = "api-rate-limit/dev/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

provider "aws" {
  region = "ap-southeast-1"
  
  default_tags {
    tags = {
      Project     = "API-Rate-Limit"
      Environment = "Development"
      ManagedBy   = "Terraform"
    }
  }
}

module "lambda" {
  source = "../../modules/lambda"

  function_name = "api-rate-limit-dev"
  environment   = "development"
  timeout       = 30
  memory_size   = 512
}

# Outputs
output "api_url" {
  description = "API endpoint URL"
  value       = module.lambda.api_endpoint
}

output "lambda_function" {
  description = "Lambda function name"
  value       = module.lambda.lambda_function_name
}