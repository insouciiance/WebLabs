using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        private readonly JwtTokenCreator _tokenCreator;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            JwtTokenCreator tokenCreator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenCreator = tokenCreator;
        }

        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserInput input)
        {
            RegisterUserInputValidator validator = new();
            IEnumerable<string> validationResult = await validator.ValidateAndGetStringsAsync(input);

            if (validationResult is not null)
            {
                return BadRequest(new { errors = validationResult });
            }

            ApplicationUser user = new()
            {
                UserName = input.UserName,
                Email = input.Email
            };

            if (_userManager.Users.Any(u => u.UserName == input.UserName || u.Email == input.Email))
            {
                return BadRequest(new { errors = new[] { ErrorMessages.UserExists } });
            }

            IdentityResult result = await _userManager.CreateAsync(user, input.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = new[] { ErrorMessages.InvalidCredentials } });
            }

            await _signInManager.SignInAsync(user, false);

            string jwtToken = _tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddMinutes(10);

            LoginUserPayload payload = new(jwtToken, expires);

            return Ok(payload);
        }

        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserInput input)
        {
            LoginUserInputValidator validator = new();
            IEnumerable<string> validationResult = await validator.ValidateAndGetStringsAsync(input);

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

            SignInResult result = await _signInManager.PasswordSignInAsync(user, input.Password, false, false);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = new[] { ErrorMessages.InvalidCredentials } });
            }

            string jwtToken = _tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddMinutes(10);

            LoginUserPayload payload = new(jwtToken, expires);

            return Ok(payload);
        }

        [Authorize]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
            }
            catch
            {
                return StatusCode(500);
            }

            return NoContent();
        }
    }
}
