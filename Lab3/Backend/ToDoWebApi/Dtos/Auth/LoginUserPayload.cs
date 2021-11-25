using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.Dtos.Auth
{
    public record LoginUserPayload(string AuthToken, string RefreshToken, string Username);
}
