variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
}

variable "timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Lambda memory in MB"
  type        = number
  default     = 512
}

variable "source_dir" {
  description = "Path to source code directory"
  type        = string
  default     = "../../../"
}