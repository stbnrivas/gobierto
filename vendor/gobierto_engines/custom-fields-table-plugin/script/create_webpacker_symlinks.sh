#!/bin/bash

engine_webpack_entry_path="app/javascripts/packs/custom_fields_table_plugin.js"
engine_webpack_source_path="app/javascripts/custom_fields_table_plugin"

echo "Running webpacker setup"

while getopts ":d:" opt; do
  case $opt in
    d) opt_dir=$OPTARG ;;
  esac
done
gobierto_dir=${opt_dir:-"$DEV_DIR/gobierto"}

if [ -z "$gobierto_dir" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script or invoke it with -d gobierto_dir, where gobierto_dir is the path of gobierto release";
else
  source_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )

  # This configuration is taken from gobierto/config/webpacker.yml
  gobierto_webpack_source_path="$gobierto_dir/app/javascript"
  gobierto_webpack_entry_path="$gobierto_webpack_source_path/packs"

  echo "    Creating webpacker symlinks..."

  echo "    executing ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path"
  ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path

  echo "    executing ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path"
  ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path

  echo "    [OK]"
fi
