using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ToDoWebApi.Services
{
    public class JwtTokenCreator
    {
        private readonly IConfiguration _configuration;

        public JwtTokenCreator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public (string Token, DateTime Expires) CreateAuthToken(IdentityUser user)
        {
            Claim[] claims =
            {
                new (JwtRegisteredClaimNames.Sub, user.Id),
                new (JwtRegisteredClaimNames.Typ, "Auth")
            };

            string signingKeyPhrase = _configuration["SigningKeyPhrase"];
            SymmetricSecurityKey signingKey = new (Encoding.UTF8.GetBytes(signingKeyPhrase));
            SigningCredentials signingCredentials = new(signingKey, SecurityAlgorithms.HmacSha256);

            DateTime expires = DateTime.Now.AddMinutes(15);

            JwtSecurityToken jwt = new(
                signingCredentials: signingCredentials,
                claims: claims,
                expires: expires
                );
            return (new JwtSecurityTokenHandler().WriteToken(jwt), expires);
        }

        public (string Token, DateTime Expires) CreateRefreshToken(IdentityUser user)
        {
            Claim[] claims =
            {
                new (JwtRegisteredClaimNames.Sub, user.Id),
                new (JwtRegisteredClaimNames.Typ, "Refresh")
            };

            string signingKeyPhrase = _configuration["SigningKeyPhrase"];
            SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(signingKeyPhrase));
            SigningCredentials signingCredentials = new(signingKey, SecurityAlgorithms.HmacSha256);

            DateTime expires = DateTime.Now.AddHours(12);

            JwtSecurityToken jwt = new(
                signingCredentials: signingCredentials,
                claims: claims,
                expires: expires
            );
            return (new JwtSecurityTokenHandler().WriteToken(jwt), expires);
        }
    }
}
