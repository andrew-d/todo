SHA 	:= $(shell git rev-parse --short HEAD)
VERSION := $(shell cat VERSION)

all: build

build:
	godep go build \
		-o todo \
		-v \
		-ldflags "-X main.revision=$(SHA) -X main.version=$(VERSION)" \
		./server

clean:
	$(RM) ./todo
