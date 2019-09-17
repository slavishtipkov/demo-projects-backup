#!/bin/bash

check_user () {
  grep -q \^${1}\: /etc/passwd && return 0
}


