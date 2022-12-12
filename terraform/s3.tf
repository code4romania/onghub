resource "aws_s3_bucket" "files" {
  bucket = "${local.namespace}-files"
}
