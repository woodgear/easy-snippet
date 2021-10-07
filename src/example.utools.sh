#!/bin/bash

code() {
	echo "sp"
}

mode() {
	echo "list"
}

separator() {
	echo "-----this-is-separator-----"
}

list() {
	rg --line-number '@snippet-line' /home/wucong/sm/ns/share |xargs -I{} echo "{} -----this-is-separator-----"
}

get-snippet() {
	local opt="$*"
	file=$(echo $opt |cut -d ':' -f 1)
	line=$(echo $opt |cut -d ':' -f 2)
	linen=$(expr $line + 1)
	sed -n "$linen,$linen p" $file
}

eval() {
	local cmd="$*"
	local snippet=$(get-snippet  $cmd)
	echo $snippet >> /test.log
	echo $snippet |xclip -selection c
}