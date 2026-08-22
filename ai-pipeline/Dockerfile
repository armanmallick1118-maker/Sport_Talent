FROM python:3.9-slim

# Install system dependencies for OpenCV, MediaPipe, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .

# Pre-install CPU-only PyTorch to save massive amounts of build memory and disk space
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Ensure storage directories exist
RUN mkdir -p storage/uploads storage/frames storage/results storage/visualizations

# Expose API port
EXPOSE 8000

# Start FastAPI application using dynamic port for Railway
CMD sh -c "uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}"
