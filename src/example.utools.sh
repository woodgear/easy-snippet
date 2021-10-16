#!/bin/bash
set -o allexport


feature() {
	# must tab
	feature=$(cat <<-EOF
		{
  		"code": "card",
  		"explain": "pick card from you note system",
  		"cmds": ["card"]
		}
	EOF
	)
	echo $feature
}

mode() {
	echo "list"
}

function get-context() {
	local opt="$*"
	local file=$(echo "$opt" |cut -d ':' -f 1)
	local line=$(echo "$opt" |cut -d ':' -f 2)
	local tips=$(echo "$opt" |cut -d ':' -f 3)
	linen=$(expr $line + 1)
	echo "---ctx"
	echo $opt
	echo "---title"
	pick-tips $opt
	echo "---description"
	get-description "'$opt'"
}

function pick-tips() {
	# echo "bash @snippet-block kubectl apply mutli line string"  |rg -o '@snipp[^\s]*\s*(.*)' -r '$1'
	# => kubectl apply mutli line string
	local tips="$*"
	echo $tips |rg -o '@snippet-([^\s]*)\s*(.*)' -r '$1 $2'
}

function pick-preview-type() {
	# echo "bash @snippet-block kubectl apply mutli line string"  |rg -o '@snipp[^\s]*\s*(.*)' -r '$1'
	# => snippet-block
	local tips="$*"
	echo $tips |rg -o '@(snipp[^\s]*)\s*(.*)' -r '$1'
}

function get-description() {
	local opt="$*"
	local file=$(echo "$opt" |cut -d ':' -f 1)
	local line=$(echo "$opt" |cut -d ':' -f 2)
	local lineend=$line
	local previewtype=$(pick-preview-type $opt)
	
	if [  "$previewtype" == "snippet-block" ]; then
		lineend=$(rg --line-number \`\`\`  $file  | xargs -I {} echo {} |grep $line -A 1 |tail -n 1|cut -d ':' -f 1)
	elif [  "$previewtype" == "snippet-line" ]; then
	 	lineend=$(expr $line + 1)
	elif [  "$previewtype" == "snippet-file" ]; then
	 	lineend=$(wc -l $file)
	else
	 	lineend=$line
	fi
	sed -n "$linen,$lineend p" $file
	echo $'\n'
}

list() {
	rg --line-number '@snippet' /home/wucong/sm/ns/share |xargs -I{} bash -c "get-context '{}'"
}

run() {
	local cmd="$*"
	local desc=$(get-description $cmd)
	echo $desc |xclip -selection c
}
