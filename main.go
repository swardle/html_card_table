package main

import (
	"log"
	"net/http"
	"os"
	"runtime"
)

func main() {
	isWin := false
	if runtime.GOOS == "windows" {
		isWin = true
	}

	// Disable log prefixes such as the default timestamp.
	// Prefix text prevents the message from being parsed as JSON.
	// A timestamp is added when shipping logs to Cloud Logging.
	log.SetFlags(0)

	port := os.Getenv("PORT")
	if port == "" {
		if isWin {
			port = "8080"
		} else {
			port = "80"
		}
		log.Printf("Defaulting to port %s", port)
	}

	http.Handle("/", http.FileServer(http.Dir("./static")))

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
