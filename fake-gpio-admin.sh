#!/bin/bash

usage () {
  echo $(basename $0): Error: $1
  echo "Usage: $(basename $0) <export|unexport> <pin>"
  exit 1
}

if [ $# -ne 2 ]; then
  usage "incorrect number of arguments"
fi

case $1 in
  export)
    [ -d /sys/class/gpio/gpio$2 ] || echo $2 >/sys/class/gpio/export
    ;;
  unexport)
    [ -d /sys/class/gpio/gpio$2 ] && echo $2 >/sys/class/gpio/unexport
    ;;
  *)
    usage "bad command $1"
    ;;
esac
