# Node 공식 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json & package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --production

# 소스 코드 복사
COPY . .

# 환경 변수 파일 복사 (로컬에서 .env 준비)
# 실제 운영에서는 OCI Secret Vault를 추천
# COPY .env .env

# 포트 노출
EXPOSE 4000

# 앱 실행
CMD ["node", "index.js"]
