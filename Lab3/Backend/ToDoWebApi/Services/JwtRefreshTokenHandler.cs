using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.Models;

namespace ToDoWebApi.Services
{
    public class JwtRefreshTokenHandler
    {
        private readonly RefreshTokensDbContext _refreshTokensDbContext;
        private readonly JwtTokenCreator _tokenCreator;

        public JwtRefreshTokenHandler(RefreshTokensDbContext refreshTokensDbContext, JwtTokenCreator tokenCreator)
        {
            _refreshTokensDbContext = refreshTokensDbContext;
            _tokenCreator = tokenCreator;
        }

        public async Task<(string Token, DateTime Expires)> WriteIfExpiredAsync(ApplicationUser user)
        {
            RefreshToken prevToken = await _refreshTokensDbContext.RefreshTokens.FirstOrDefaultAsync(t => t.UserId == user.Id);

            if (prevToken is not null)
            {
                if (prevToken.Expires > DateTime.Now)
                {
                    return (prevToken.Token, prevToken.Expires);
                }

                _refreshTokensDbContext.RefreshTokens.Remove(prevToken);
            }

            var refreshToken = _tokenCreator.CreateRefreshToken(user);

            RefreshToken newToken = new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                Token = refreshToken.Token,
                Expires = refreshToken.Expires
            };
            _refreshTokensDbContext.RefreshTokens.Add(newToken);

            await _refreshTokensDbContext.SaveChangesAsync();

            return refreshToken;
        }

        public async Task<bool> IsTokenValidAsync(string token)
        {
            RefreshToken refreshToken = await _refreshTokensDbContext.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);

            return refreshToken is not null && refreshToken.Expires > DateTime.Now;
        }
    }
}
