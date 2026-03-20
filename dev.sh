#!/bin/bash

# Run backend in subshell to avoid blocking the ui:start task
(cd backend && sh start.sh) &

# Start the UI development server
deno task ui:start