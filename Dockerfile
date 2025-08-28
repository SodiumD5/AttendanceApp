# 1. Ubuntu 기반 이미지
FROM ubuntu:22.04

# 2. 환경 변수 설정
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# 3. 시스템 업데이트 + 필수 패키지 + 한글 폰트 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    wget \
    curl \
    unzip \
    fontconfig \
    locales \
    xfonts-75dpi \
    xfonts-base \
    fonts-nanum \
    ca-certificates \
    wkhtmltopdf \
    && rm -rf /var/lib/apt/lists/*

# 4. 한글 로케일 설정
RUN locale-gen ko_KR.UTF-8
ENV LANG=ko_KR.UTF-8
ENV LANGUAGE=ko_KR:ko
ENV LC_ALL=ko_KR.UTF-8

# 5. 폰트 캐시 갱신
RUN fc-cache -fv

# 6. 작업 디렉토리
WORKDIR /app

# 7. requirements.txt 복사 및 설치
COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# 8. 애플리케이션 복사
COPY main.py .
COPY api ./api
COPY static ./static
COPY database ./database

# 9. 컨테이너 시작 시 실행
CMD ["python3", "main.py"]
