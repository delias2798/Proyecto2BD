import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Neo4jService } from './neo4j.service';

describe('Neo4jService', () => {
  let service: Neo4jService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api'; // Update with your backend URL

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Neo4jService],
    });
    service = TestBed.inject(Neo4jService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load CSV data', () => {
    const mockResponse = { message: 'CSV loaded successfully' };

    service.loadCsv().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/loadCsv`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get graph data', () => {
    const mockGraphData = { nodes: [], edges: [] };

    service.getGraphData().subscribe((response) => {
      expect(response).toEqual(mockGraphData);
    });

    const req = httpMock.expectOne(`${apiUrl}/nodes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGraphData);
  });

  it('should get nodes by type', () => {
    const type = 'Proyecto';
    const mockNodes = [{ id: '1', properties: { titulo: 'Test Project' } }];

    service.getNodes(type).subscribe((response) => {
      expect(response).toEqual(mockNodes);
    });

    const req = httpMock.expectOne(`${apiUrl}/nodes/${type}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNodes);
  });

  it('should create a node', () => {
    const type = 'Proyecto';
    const properties = { titulo: 'New Project' };
    const mockResponse = { id: '123', properties };

    service.createNode(type, properties).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/node/${type}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(properties);
    req.flush(mockResponse);
  });

  it('should update a node', () => {
    const type = 'Proyecto';
    const id = '123';
    const properties = { titulo: 'Updated Project' };
    const mockResponse = { id, properties };

    service.updateNode(type, id, properties).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/node/${type}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ properties });
    req.flush(mockResponse);
  });

  it('should delete a node', () => {
    const type = 'Proyecto';
    const id = '123';
    const mockResponse = { message: 'Node deleted successfully' };

    service.deleteNode(type, id).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/node/${type}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should get applications by region', () => {
    const region = 'Algeria';
    const mockApplications = ['App1', 'App2'];

    service.getAplicacionesPorRegion(region).subscribe((response) => {
      expect(response).toEqual(mockApplications);
    });

    const req = httpMock.expectOne(`${apiUrl}/consultas/aplicacionesPorRegion?region=${region}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApplications);
  });

  it('should clean the database', () => {
    const mockResponse = { message: 'Database cleaned successfully' };

    service.cleanDatabase().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/cleanDatabase`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
