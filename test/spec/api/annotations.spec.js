/* jshint camelcase: false */
'use strict';

var axios = require('axios');
var Bluebird = require('bluebird');

describe('annotations api', function() {

    var api = require('../../../lib/api');
    var annotationsApi = api.annotations;
    var baseUrl = 'https://api.mendeley.com';

    var mockAuth = require('../../mocks/auth');
    api.setAuthFlow(mockAuth.mockImplicitGrantFlow());

    describe('list method', function() {

        var ajaxSpy;
        var ajaxRequest;
        var params = {
            limit: 500
        };

        it('be defined', function(done) {
            expect(typeof annotationsApi.list).toBe('function');
            ajaxSpy = spyOn(axios, 'request').and.returnValue(Bluebird.resolve({headers: {}}));

            annotationsApi.list(params).finally(function() {
                expect(ajaxSpy).toHaveBeenCalled();
                ajaxRequest = ajaxSpy.calls.mostRecent().args[0];
                done();
            });
        });

        it('should use GET', function() {
            expect(ajaxRequest.method).toBe('get');
        });

        it('should use endpoint /annotations/', function() {
            expect(ajaxRequest.url).toBe(baseUrl + '/annotations/');
        });

        it('should NOT have a Content-Type header', function() {
            expect(ajaxRequest.headers['Content-Type']).not.toBeDefined();
        });

        it('should have an Authorization header', function() {
            expect(ajaxRequest.headers.Authorization).toBeDefined();
            expect(ajaxRequest.headers.Authorization).toBe('Bearer auth');
        });

        it('should apply request params', function() {
            expect(ajaxRequest.params).toEqual(params);
        });
    });

    describe('retrieve method', function() {

        var ajaxSpy;
        var ajaxRequest;

        it('should be defined', function(done) {
            expect(typeof annotationsApi.retrieve).toBe('function');
            ajaxSpy = spyOn(axios, 'request').and.returnValue(Bluebird.resolve({headers: {}}));
            annotationsApi.retrieve(123).finally(function() {
                expect(ajaxSpy).toHaveBeenCalled();
                ajaxRequest = ajaxSpy.calls.mostRecent().args[0];
                done();
            });
        });

        it('should use GET', function() {
            expect(ajaxRequest.method).toBe('get');
        });

        it('should use endpoint /annotations/{id}', function() {
            expect(ajaxRequest.url).toBe(baseUrl + '/annotations/123');
        });

        it('should NOT have a Content-Type header', function() {
            expect(ajaxRequest.headers['Content-Type']).not.toBeDefined();
        });

        it('should have an Authorization header', function() {
            expect(ajaxRequest.headers.Authorization).toBeDefined();
            expect(ajaxRequest.headers.Authorization).toBe('Bearer auth');
        });

        it('should NOT have a body', function() {
            expect(ajaxRequest.data).toBeUndefined();
        });
    });

    describe('create method', function() {
        var ajaxSpy, ajaxRequest;

        it('should be defined', function(done) {
            expect(typeof annotationsApi.create).toBe('function');
            ajaxSpy = spyOn(axios, 'request').and.returnValue(Bluebird.resolve({headers: {}}));
            annotationsApi.create({document_id: 123, text: 'new annotation'}).finally(function() {
                expect(ajaxSpy).toHaveBeenCalled();
                ajaxRequest = ajaxSpy.calls.mostRecent().args[0];
                done();
            });
        });

        it('should use POST', function() {
            expect(ajaxRequest.method).toBe('post');
        });

        it('should use endpoint https://api.mendeley.com/annotations/', function() {
            expect(ajaxRequest.url).toBe(baseUrl + '/annotations/');
        });

        it('should have a Content-Type header', function() {
            expect(ajaxRequest.headers['Content-Type']).toBeDefined();
        });

        it('should have an Authorization header', function() {
            expect(ajaxRequest.headers.Authorization).toBeDefined();
            expect(ajaxRequest.headers.Authorization).toBe('Bearer auth');
        });

        it('should have a body of JSON string', function() {
            expect(ajaxRequest.data).toBe('{"document_id":123,"text":"new annotation"}');
        });

    });

    describe('delete method', function() {
        var ajaxSpy, ajaxRequest;

        it('should be defined', function(done) {
            expect(typeof annotationsApi.delete).toBe('function');
            ajaxSpy = spyOn(axios, 'request').and.returnValue(Bluebird.resolve({headers: {}}));
            annotationsApi.delete(123).finally(function() {
                expect(ajaxSpy).toHaveBeenCalled();
                ajaxRequest = ajaxSpy.calls.mostRecent().args[0];
                done();
            });
        });

        it('should use DELETE', function() {
            expect(ajaxRequest.method).toBe('delete');
        });

        it('should use endpoint https://api.mendeley.com/annotations/{annotation_id}', function() {
            expect(ajaxRequest.url).toBe(baseUrl + '/annotations/123');
        });

        it('should have an Authorization header', function() {
            expect(ajaxRequest.headers.Authorization).toBeDefined();
            expect(ajaxRequest.headers.Authorization).toBe('Bearer auth');
        });

        it('should not have a response body', function() {
            expect(ajaxRequest.data).toBeUndefined;
        });

    });

    describe('patch method', function() {
        var ajaxSpy, ajaxRequest;

        it('should be defined', function(done) {
            expect(typeof annotationsApi.patch).toBe('function');
            ajaxSpy = spyOn(axios, 'request').and.returnValue(Bluebird.resolve({headers: {}}));
            annotationsApi.patch(123, {text: 'updated annotation'}).finally(function() {
                expect(ajaxSpy).toHaveBeenCalled();
                ajaxRequest = ajaxSpy.calls.mostRecent().args[0];
                done();
            });
        });

        it('should use PATCH', function() {
            expect(ajaxRequest.method).toBe('patch');
        });

        it('should use endpoint https://api.mendeley.com/annotations/{annotation_id}', function() {
            expect(ajaxRequest.url).toBe(baseUrl + '/annotations/123');
        });

        it('should have a Content-Type header', function() {
            expect(ajaxRequest.headers['Content-Type']).toBeDefined();
        });

        it('should have an Authorization header', function() {
            expect(ajaxRequest.headers.Authorization).toBeDefined();
            expect(ajaxRequest.headers.Authorization).toBe('Bearer auth');
        });

        it('should have a body of JSON', function() {
            expect(ajaxRequest.data).toBe('{"text":"updated annotation"}');
        });

    });

    describe('pagination', function() {

        var linkNext = baseUrl + '/annotations/?limit=5&reverse=false&marker=03726a18-140d-3e79-9c2f-b63473668359';
        var linkLast = baseUrl + '/annotations/?limit=5&reverse=true';

        function ajaxSpy() {
            return spyOn(axios, 'request').and.returnValue(Bluebird.resolve({
                headers: {
                    link: '<' + linkNext + '>; rel="next",<' + linkLast + '>; rel="last"',
                    'mendeley-count': 56
                }
            }));
        }

        it('should parse link headers', function(done) {
            ajaxSpy();
            annotationsApi.paginationLinks.next = 'nonsense';
            annotationsApi.paginationLinks.prev = 'nonsense';
            annotationsApi.paginationLinks.last = 'nonsense';

            annotationsApi.list().then(function() {
                expect(annotationsApi.paginationLinks.next).toEqual(linkNext);
                expect(annotationsApi.paginationLinks.last).toEqual(linkLast);
                expect(annotationsApi.paginationLinks.prev).toEqual(false);
                done();
            }).catch(function() {});

        });

        it('should get correct link on nextPage()', function(done) {
            var spy = ajaxSpy();
            annotationsApi.nextPage().finally(function() {
                expect(spy.calls.mostRecent().args[0].url).toEqual(linkNext);
                done();
            });
        });

        it('should get correct link on lastPage()', function(done) {
            var spy = ajaxSpy();
            annotationsApi.lastPage().finally(function() {
                expect(spy.calls.mostRecent().args[0].url).toEqual(linkLast);
                done();
            });
        });

        it('should fail if no link for rel', function(done) {
            var spy = ajaxSpy();
            annotationsApi.previousPage().catch(function() {
                expect(spy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should store the total document count', function(done) {
            ajaxSpy();
            annotationsApi.list().finally(function() {
                expect(annotationsApi.count).toEqual(56);
                done();
            });
        });

        it('should not break when you GET something else that does not have pagination links', function(done) {
            ajaxSpy();

            annotationsApi.list().finally(function() {
                expect(annotationsApi.paginationLinks.next).toEqual(linkNext);
                expect(annotationsApi.paginationLinks.last).toEqual(linkLast);
                expect(annotationsApi.paginationLinks.prev).toEqual(false);

                return annotationsApi.retrieve(56);
            }).finally(function() {
                expect(annotationsApi.paginationLinks.next).toEqual(linkNext);
                expect(annotationsApi.paginationLinks.last).toEqual(linkLast);
                expect(annotationsApi.paginationLinks.prev).toEqual(false);
                
                done();
            });
        });

    });
});
/* jshint camelcase: true */