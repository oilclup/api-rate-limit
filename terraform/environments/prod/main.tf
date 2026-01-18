terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket = "natthapong-terraform-state-bucket-12345" 
    key    = "api-rate-limit/prod/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

provider "aws" {
  region = "ap-southeast-1"
  
  default_tags {
    tags = {
      Project     = "API-Rate-Limit"
      Environment = "Production"
      ManagedBy   = "Terraform"
    }
  }
}

module "lambda" {
  source = "../../modules/lambda"

  function_name = "api-rate-limit-prod"
  environment   = "production"
  timeout       = 60
  memory_size   = 2048
}

output "api_url" {
  value = module.lambda.api_endpoint
}

output "lambda_function" {
  value = module.lambda.lambda_function_name
}