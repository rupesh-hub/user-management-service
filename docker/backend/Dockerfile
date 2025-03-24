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
COPY --from=build /build/target/ums-backend-*.jar /app/
EXPOSE 8181

ARG APP_VERSION=1.0.0
ARG PROFILE=development

ENV JAR_VERSION=${APP_VERSION}
ENV ACTIVE_PROFILE=${PROFILE}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} ums-backend-${JAR_VERSION}.jar