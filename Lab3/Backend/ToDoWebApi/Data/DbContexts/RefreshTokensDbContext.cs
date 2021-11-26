using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ToDoWebApi.Models;

namespace ToDoWebApi.Data.DbContexts
{
    public class RefreshTokensDbContext : DbContext
    {
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public RefreshTokensDbContext(DbContextOptions options) : base(options) { }
    }
}
