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

        public string Create(IdentityUser user)
        {
            Claim[] claims =
            {
                new (JwtRegisteredClaimNames.Sub, user.Id)
            };

            string signingKeyPhrase = _configuration["SigningKeyPhrase"];
            SymmetricSecurityKey signingKey = new (Encoding.UTF8.GetBytes(signingKeyPhrase));
            SigningCredentials signingCredentials = new(signingKey, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken jwt = new(
                signingCredentials: signingCredentials,
                claims: claims,
                expires: DateTime.Now.AddMinutes(10)
                );
            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
