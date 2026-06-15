var builder = WebApplication.CreateBuilder(args);

// ✅ Set Port to 5163
builder.WebHost.UseUrls("http://localhost:5163");

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();