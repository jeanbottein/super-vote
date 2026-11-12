# The server as it runs in production (deploy/compose.yaml): the JVM, on Temurin 25.
# Built from source, so that `docker build servers/java` needs nothing but Docker.
# Base images are pinned by digest, which Dependabot keeps current.

FROM eclipse-temurin:25-jdk-noble@sha256:95e350ad1eb738f943e141640f7e3d797e483359a3b33c3864255bfd1ad71f8a AS build
WORKDIR /build
# The dependencies first, in a layer of their own: kept from one build to the next while pom.xml stays the same.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -B -ntp -q dependency:go-offline
COPY src/ src/
# The tests ran before this commit could reach main (.github/workflows/ci.yml). The jar is then split into
# its libraries and the application, which changes far more often: a new version ships a small layer.
RUN ./mvnw -B -ntp -q package -DskipTests \
    && java -Djarmode=tools -jar target/super-vote-server-*.jar extract --layers \
        --application-filename super-vote-server.jar --destination extracted

FROM eclipse-temurin:25-jre-noble@sha256:a98128a57de944a72bd31fbc79b898edd5a5864d3652071d5bbd2160ab7d7dce
LABEL org.opencontainers.image.source="https://github.com/jeanbottein/super-vote" \
      org.opencontainers.image.description="super-vote server: REST, server-sent events and MCP tools" \
      org.opencontainers.image.licenses="MIT"
RUN useradd --system --no-create-home --shell /usr/sbin/nologin super-vote
WORKDIR /app
COPY --from=build /build/extracted/dependencies/ ./
COPY --from=build /build/extracted/spring-boot-loader/ ./
COPY --from=build /build/extracted/snapshot-dependencies/ ./
COPY --from=build /build/extracted/application/ ./
USER super-vote
EXPOSE 8080
# Out of memory, the JVM stops rather than limping on, and Docker starts it again.
ENTRYPOINT ["java", "-XX:+ExitOnOutOfMemoryError", "-jar", "super-vote-server.jar"]
