#1. Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean install -DskipTests

#2. Runtime state
FROM amazoncorretto:17
WORKDIR /app
COPY --from=build /build/target/user-management-service-backend-*.jar /app/
EXPOSE 8181

ARG APP_VERSION=1.0.0
ARG PROFILE=development
ARG DB_URL=jdbc:mysql://mysql:3306/user_db

ENV JAR_VERSION=${APP_VERSION}
ENV ACTIVE_PROFILE=${PROFILE}
ENV DATABASE_URL=${DB_URL}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DATABASE_URL} user-management-service-backend-${JAR_VERSION}.jar

# docker build -t rupesh1997/user-management-service-backend:1.0.0 -f ../docker/backend/Dockerfile .