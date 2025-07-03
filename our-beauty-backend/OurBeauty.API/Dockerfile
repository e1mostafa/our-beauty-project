# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the .csproj file and restore dependencies
COPY ./OurBeauty.API/ ./OurBeauty.API/
RUN dotnet restore ./OurBeauty.API/OurBeauty.API.csproj

# Copy the rest of the source code
COPY . ./

# Publish the application
RUN dotnet publish ./OurBeauty.API/OurBeauty.API.csproj -c Release -o out

# Use the smaller ASP.NET runtime image for the final container
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "OurBeauty.API.dll"]