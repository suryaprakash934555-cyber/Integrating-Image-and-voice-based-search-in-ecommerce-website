
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Header from './Header';

function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, query, searchType } = location.state || {};

  if (!results) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          No search results found. Please try a different search.
        </Alert>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </Container>
    );
  }

  const products = results.products || results.results || [];

  return (
    <>
    <Header/>
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Search Results for "{query}"
          {searchType === 'image' && ' (Image Search)'}
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          New Search
        </Button>
      </div>
      
      {products.length === 0 ? (
        <Alert variant="info">
          No products found matching your search criteria.
        </Alert>
      ) : (
        <>
          <p className="text-muted">Found {products.length} products</p>
          <Row>
            {products.map((product) => (
              <Col key={product.id} md={3} className="mb-4">
                <Card className="h-100">
                  <Card.Img 
                    variant="top" 
                    src={product.image_url} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6">{product.name}</Card.Title>
                    <Card.Text className="text-muted small">{product.style}</Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">${product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-muted text-decoration-line-through small">
                            ${product.mrp}
                          </span>
                        )}
                      </div>
                      <Button variant="primary" size="sm" className="w-100 mt-2">
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
    </>
  );
}

export default SearchResult;