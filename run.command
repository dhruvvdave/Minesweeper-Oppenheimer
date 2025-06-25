#!/bin/bash
cd "$(dirname "$0")"
java --module-path ~/Downloads/javafx-sdk-21.0.7/lib \
     --add-modules javafx.controls \
     MinesweeperFX
