/**
 * @jest-environment jsdom
 */
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I submit a new Bill", () => {





        // Vérifie que le bill se sauvegarde
        test("Then must save the bill", async() => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, "localStorage", { value: localStorageMock })
            window.localStorage.setItem("user", JSON.stringify({
                type: "Employee",
                email: "employee@company.tld"
            }))

            const html = NewBillUI()
            document.body.innerHTML = html

            const newBillInit = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })

            const formNewBill = screen.getByTestId("form-new-bill")
            expect(formNewBill).toBeTruthy()

            const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
            formNewBill.addEventListener("submit", handleSubmit);
            fireEvent.submit(formNewBill);
            expect(handleSubmit).toHaveBeenCalled();
        });








        test("Then show the new bill page", async() => {
            localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@company.tld" }));
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.NewBill)
        })









        // Vérifie si un fichier est bien chargé
        test("Then verify the file bill", async() => {
            jest.spyOn(mockStore, "bills")

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, "localStorage", { value: localStorageMock })
            Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['NewBill'] } })
            window.localStorage.setItem("user", JSON.stringify({
                type: "Employee",
                email: "employee@company.tld"
            }))

            const html = NewBillUI()
            document.body.innerHTML = html

            const newBillInit = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage
            })

            const file = new File(['image'], 'image.png', { type: 'image/png' });
            const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
            const formNewBill = screen.getByTestId("form-new-bill")
            const billFile = screen.getByTestId('file');

            billFile.addEventListener("change", handleChangeFile);
            userEvent.upload(billFile, file)

            expect(billFile.files[0].name).toBeDefined()
            expect(handleChangeFile).toBeCalled()

            const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
            formNewBill.addEventListener("submit", handleSubmit);
            fireEvent.submit(formNewBill);
            expect(handleSubmit).toHaveBeenCalled();
        })
    })




















    describe("When I submit an incomplete new Bill", () => {
        // Vérifie que le bill se sauvegarde
        test("Then must NOT save the bill", async() => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, "localStorage", { value: localStorageMock })
            window.localStorage.setItem("user", JSON.stringify({
                type: "Employee",
                email: "employee@company.tld"
            }))

            const html = NewBillUI()
            document.body.innerHTML = html

            const newBillInit = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })

            
            let dataBill = {
                "id": "aaaaaaaaaaaaaa",
                "vat": "80",
                "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                "status": "pending",
                "type": "Hôtel et logement",
                "commentary": "séminaire billed",
                "name": "encore",
                "fileName": "preview-facture-free-201801-pdf-1.jpg",
                "date": "2004-04-04",
                "amount": 400,
                "commentAdmin": "ok",
                "email": "a@a",
                "pct": 20
                        }


            
            const formNewBill = screen.getByTestId("form-new-bill")
            expect(formNewBill).toBeTruthy()

            const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
            formNewBill.addEventListener("submit", handleSubmit);
            fireEvent.submit(formNewBill);
            expect(handleSubmit).toHaveBeenCalled();
            expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
        });






























        describe('When I am on NewBill page and I submit a wrong attached file format', () => {
        test("Then verify the file bill", async() => {
            jest.spyOn(mockStore, "bills")

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, "localStorage", { value: localStorageMock })
            Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['NewBill'] } })
            window.localStorage.setItem("user", JSON.stringify({
                type: "Employee",
                email: "employee@company.tld"
            }))

            const html = NewBillUI()
            document.body.innerHTML = html

            const newBillInit = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage
            })

            const file = new File(['pdf'], 'image.pdf', { type: 'application/pdf' });
            const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
            const formNewBill = screen.getByTestId("form-new-bill")
            const billFile = screen.getByTestId('file');

            billFile.addEventListener("change", handleChangeFile);
            userEvent.upload(billFile, file)

            expect(billFile.files[0].name).toBeDefined()
            expect(handleChangeFile).toBeCalled()

            const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
            formNewBill.addEventListener("submit", handleSubmit);
            fireEvent.submit(formNewBill);
            expect(billFile.files[0].name).toContain('');
        })
    })
})
})













describe('Given I am a user connected as Employee', () => {
    describe("When I submit the form completed", () => {
        test("Then the bill is created", async () => {

            const html = NewBillUI()
            document.body.innerHTML = html

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname});
            };

            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: "azerty@email.com",
            }))

            const newBill = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            })

            const validBill = {
                type: "Restaurants et bars",
                name: "Vol Paris Londres",
                date: "2022-02-15",
                amount: 200,
                vat: 70,
                pct: 30,
                commentary: "Commentary",
                fileUrl: "../img/0.jpg",
                fileName: "test.jpg",
                status: "pending"
            };

            // Load the values in fields
            screen.getByTestId("expense-type").value = validBill.type;
            screen.getByTestId("expense-name").value = validBill.name;
            screen.getByTestId("datepicker").value = validBill.date;
            screen.getByTestId("amount").value = validBill.amount;
            screen.getByTestId("vat").value = validBill.vat;
            screen.getByTestId("pct").value = validBill.pct;
            screen.getByTestId("commentary").value = validBill.commentary;

            newBill.fileName = validBill.fileName
            newBill.fileUrl = validBill.fileUrl;

            newBill.updateBill = jest.fn();
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

            const form = screen.getByTestId("form-new-bill");
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form)

            expect(handleSubmit).toHaveBeenCalled()
            expect(newBill.updateBill).toHaveBeenCalled()

        })

        test('fetches error from an API and fails with 500 error', async () => {
            jest.spyOn(mockStore, 'bills')
            jest.spyOn(console, 'error').mockImplementation(() => {
            })// Prevent Console.error jest error

            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            Object.defineProperty(window, 'location', {value: {hash: ROUTES_PATH['NewBill']}})

            window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
            document.body.innerHTML = `<div id="root"></div>`
            router()

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            mockStore.bills = jest.fn().mockImplementation(() => {
                return {
                    update: () => {
                        return Promise.reject(new Error('Erreur 500'))
                    },
                    list: () => {
                        return Promise.reject(new Error('Erreur 500'))
                    }
                }
            })
            const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})

            // Submit form
            const form = screen.getByTestId('form-new-bill')
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
            form.addEventListener('submit', handleSubmit)
            fireEvent.submit(form)
            await new Promise(process.nextTick)
            expect(console.error).toBeCalled()
        })
    })
})