using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.Dtos.Auth;
using ToDoWebApi.Models;
using ToDoWebApi.Services;
using ToDoWebApi.Services.Extensions;
using ToDoWebApi.Services.Validators;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace ToDoWebApi.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IHttpContextAccessor _contextAccessor;

        private readonly JwtTokenCreator _tokenCreator;
        private readonly JwtRefreshTokenHandler _refreshTokenHandler;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IHttpContextAccessor contextAccessor,
            JwtTokenCreator tokenCreator,
            JwtRefreshTokenHandler refreshTokenHandler)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextAccessor = contextAccessor;
            _tokenCreator = tokenCreator;
            _refreshTokenHandler = refreshTokenHandler;
        }

        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserInput input)
        {
            RegisterUserInputValidator validator = new ();
            IEnumerable<string> validationResult = await validator.ValidateAndGetStringsAsync(input).ConfigureAwait(false);

            if (validationResult is not null)
            {
                return BadRequest(new { errors = validationResult });
            }

            ApplicationUser user = new ()
            {
                UserName = input.UserName,
                Email = input.Email
            };

            if (_userManager.Users.Any(u => u.UserName == input.UserName || u.Email == input.Email))
            {
                return BadRequest(new { errors = new[] { ErrorMessages.UserExists } });
            }

            IdentityResult result = await _userManager.CreateAsync(user, input.Password).ConfigureAwait(false);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = new[] { ErrorMessages.InvalidCredentials } });
            }

            await _signInManager.SignInAsync(user, false).ConfigureAwait(false);

            var (refreshToken, _) = await _refreshTokenHandler.WriteIfExpiredAsync(user).ConfigureAwait(false);

            var (authToken, _) = _tokenCreator.CreateAuthToken(user);

            LoginUserPayload payload = new (authToken, refreshToken, user.UserName);

            return Ok(payload);
        }

        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserInput input)
        {
            LoginUserInputValidator validator = new ();
            IEnumerable<string> validationResult = await validator.ValidateAndGetStringsAsync(input).ConfigureAwait(false);

            if (validationResult is not null)
            {
                return BadRequest(new { errors = validationResult });
            }

            string userName = input.UserName;
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.UserName == userName);

            if (user is null)
            {
                return BadRequest(new { errors = new[] { ErrorMessages.InvalidCredentials } });
            }

            SignInResult result = await _signInManager.PasswordSignInAsync(user, input.Password, false, false).ConfigureAwait(false);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = new[] { ErrorMessages.InvalidCredentials } });
            }

            var (refreshToken, _) = await _refreshTokenHandler.WriteIfExpiredAsync(user).ConfigureAwait(false);

            var (authToken, _) = _tokenCreator.CreateAuthToken(user);

            LoginUserPayload payload = new (authToken, refreshToken, user.UserName);

            return Ok(payload);
        }

        [Authorize(Policy = "Refresh")]
        [Route("refresh")]
        public async Task<IActionResult> Refresh()
        {
            string tokenHeader = _contextAccessor.HttpContext!.Request.Headers["Authorization"].ToString();
            string refreshToken = tokenHeader.Split(' ')[1];

            bool isRefreshValid = await _refreshTokenHandler.IsTokenValidAsync(refreshToken).ConfigureAwait(false);

            if (!isRefreshValid)
            {
                return Forbid();
            }

            string userId = _contextAccessor.HttpContext!.User.Claims.First().Value;
            ApplicationUser user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId).ConfigureAwait(false);

            if (user is null)
            {
                return NotFound();
            }

            var authToken = _tokenCreator.CreateAuthToken(user);

            return Ok(new { refreshToken, authToken = authToken.Token });
        }

        [Authorize(Policy = "Auth")]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync().ConfigureAwait(false);
            }
            catch
            {
                return StatusCode(500);
            }

            return NoContent();
        }
    }
}
