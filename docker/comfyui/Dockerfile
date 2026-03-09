# ComfyUI container with Apple Metal acceleration support
# Note: Metal GPU acceleration requires macOS host with Docker Desktop GPU passthrough
FROM python:3.11-slim

WORKDIR /comfyui

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install ComfyUI
RUN git clone https://github.com/comfyanonymous/ComfyUI.git . \
    && pip install --no-cache-dir -r requirements.txt

# Install custom nodes for background removal
RUN cd custom_nodes \
    && git clone https://github.com/BRIA-AI/ComfyUI-BRIA-RMBG.git \
    && cd ComfyUI-BRIA-RMBG \
    && pip install --no-cache-dir -r requirements.txt

# Copy extra model paths config
COPY extra_model_paths.yaml /comfyui/

# Create output directory
RUN mkdir -p /comfyui/output

EXPOSE 8188

# Start ComfyUI with listen on all interfaces
CMD ["python", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
