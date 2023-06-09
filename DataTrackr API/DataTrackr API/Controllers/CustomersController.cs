﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using DataTrackrAPI.DTO.Country;
using DataTrackrAPI.DTO.Customer;
using DataTrackrAPI.Models;
using DataTrackr_Web_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataTrackrAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class CustomersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ApiDbContext _context;

        public CustomersController(ApiDbContext context, IMapper mapper)
        {
            _context = context;
            this._mapper = mapper;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCustomerDto>>> GetCustomers()
        {
            var customers=await _context.Customers.ToListAsync();
            var records = _mapper.Map<List<GetCustomerDto>>(customers);
            return Ok(records);
        }

        // GET: api/Customers/fetchAccounts?StartIndex=0&PageSize=25&PageNumber=1 (Paginated)
        [HttpGet]
        [Route("/api/Customers$fetch")]
        public async Task<ActionResult<PagedResult<GetCustomerDto>>> GetPagedCustomers([FromQuery] QueryParameters queryParameters)
        {
            var totalSize = await _context.Customers.CountAsync();
            var items = await _context.Customers
                .Skip(queryParameters.StartIndex)
                .Take(queryParameters.PageSize)
                .ProjectTo<GetCustomerDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
            var pagedCustomersResult = new PagedResult<GetCustomerDto>
            {
                Items = items,
                PageNumber = queryParameters.PageNumber,
                RecordNumber = queryParameters.PageSize,
                TotalCount = totalSize
            };
            return Ok(pagedCustomersResult);
        }

        // GET: api/Customers$like?search=sagar
        [HttpGet]
        [Route("/api/Customers$like")]
        public async Task<ActionResult<IEnumerable<GetCustomerDto>>> SearchCustomers([FromQuery] string search)
        {
            var customers = await _context.Customers.Where(d => d.CustomerName.Contains(search) || d.CountryCode.Contains(search) || d.Description.Contains(search) || d.Sector.Contains(search)).ToListAsync();
            var records = _mapper.Map<List<GetCustomerDto>>(customers);
            return Ok(records);
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(string id)
        {
            var customer = await _context.Customers.Include(q=>q.Headquarters).Include(q=>q.Accounts).ThenInclude(q=>q.Location).FirstOrDefaultAsync(q=>q.CustomerEmail==id);
            if (customer == null)
            {
                return NotFound();
            }
            var customerDetailsDto = _mapper.Map<GetCustomerDetailsWithAccountsDTO>(customer);
            return Ok(customerDetailsDto);
        }

        // GET: api/Customers/CustomerDetails/5
        [HttpGet("CustomerDetails/{id}")]
        public async Task<ActionResult<Customer>> GetCustomerDetails(string id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(q => q.CustomerEmail == id);
            if (customer == null)
            {
                return NotFound();
            }
            var customerDetailsDto = _mapper.Map<GetCustomerDto>(customer);
            return Ok(customerDetailsDto);
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(string id, UpdateCustomerDto updateData)
        {
            if (id != updateData.CustomerEmail)
            {
                return BadRequest();
            }

            //_context.Entry(updateCustomerDto).State = EntityState.Modified;
            var currentCustomer = await _context.Customers.FirstOrDefaultAsync(q => q.CustomerEmail == id);
            if (currentCustomer==null)
            {
                return NotFound();
            }
            //_mapper.Map(updateCustomerDto, customer);

            var CoordinateId=currentCustomer.CoordinateId;
            var currentLocation = await _context.Coordinates.FirstOrDefaultAsync(q => q.CoordinateId == CoordinateId);

            currentCustomer.CustomerName = updateData.CustomerName;
            currentCustomer.Logo = updateData.Logo;
            currentCustomer.Sector = updateData.Sector;
            currentCustomer.PhoneNumber = updateData.PhoneNumber;
            currentCustomer.CountryCode = updateData.CountryCode;
            currentCustomer.Description = updateData.Description;
            currentCustomer.Website = updateData.Website;
            currentLocation.Latitude = updateData.Headquarters.Latitude;
            currentLocation.Longitude = updateData.Headquarters.Longitude;
            currentLocation.Address = updateData.Headquarters.Address;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(updateData);
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(CreateCustomerDto createcustomer) { 
            var customer = _mapper.Map<Customer>(createcustomer);
            _context.Customers.Add(customer);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CustomerExists(customer.CustomerEmail))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCustomer", new { id = customer.CustomerEmail }, customer);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(string id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(q => q.CustomerEmail == id);
            var CoordinateId = customer.CoordinateId;
            var location= await _context.Coordinates.FirstOrDefaultAsync(q => q.CoordinateId== CoordinateId);

            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            _context.Coordinates.Remove(location);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool CustomerExists(string id)
        {
            return _context.Customers.Any(e => e.CustomerEmail == id);
        }
    }
}
