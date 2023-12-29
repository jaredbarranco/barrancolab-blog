#!/bin/bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <new_post_name>"
    exit 1
fi

# Set the project root directory
projectRoot=$(dirname "$(readlink -f "$0")")/..

# Define paths
templatePath="$projectRoot/content/posts/template.md"
newPostName="$1"
newPostPath="$projectRoot/content/posts/$(echo "$newPostName" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')".md

# Check if the template file exists
if [ ! -e "$templatePath" ]; then
    echo "Error: Template file not found at $templatePath"
    exit 1
fi

# Check if the new post file already exists
if [ -e "$newPostPath" ]; then
    echo "Error: A post with the name $1 already exists at $newPostPath"
    exit 1
fi

# Copy the template to the new file
cp "$templatePath" "$newPostPath"

# Perform find and replace operations
sed -i.bak "s|TEMPLATE_TITLE|$1|g" "$newPostPath"
sed -i.bak "s|TEMPLATE_DATE|$(date -u +"%Y-%m-%dT%H:%M:%SZ")|g" "$newPostPath"
sed -i.bak "s|TEMPLATE_UUID|$(uuidgen)|g" "$newPostPath"

# Remove backup files created by sed
rm -f "$newPostPath.bak"

# Output success message
echo "New post created: $newPostPath"
