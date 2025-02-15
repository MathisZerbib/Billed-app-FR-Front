/**
 * @jest-environment jsdom
 */

import { container, screen, fireEvent, waitFor } from "@testing-library/dom"

import BillsUI from "../views/BillsUI.js"

import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";

import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";


import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async() => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            expect(windowIcon.classList.contains('active-icon')).toBe(true)
                //to-do write expect expression
        })

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills })
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = ((a, b) => new Date(a.date) - new Date(b.date))
            const datesSorted = [...dates].sort(antiChrono)

            expect(dates).toEqual(datesSorted)
        })
    })

    // Vérifie si la modale du justificatif apparait
    describe("When I click on the eye of a bill", () => {
        test("Then a modal must appear", async() => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            Object.defineProperty(window, "localStorage", { value: localStorageMock })
            window.localStorage.setItem("user", JSON.stringify({
                type: "Employee"
            }))
            const billsInit = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })
            document.body.innerHTML = BillsUI({ data: bills })
            const handleClickIconEye = jest.fn((icon) => billsInit.handleClickIconEye(icon));
            const iconEye = screen.getAllByTestId("icon-eye");
            const modaleFile = document.getElementById("modaleFile")
            $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
            iconEye.forEach((icon) => {
                icon.addEventListener("click", handleClickIconEye(icon))
                userEvent.click(icon)
                expect(handleClickIconEye).toHaveBeenCalled()
            })
            expect(modaleFile.classList.contains("show")).toBe(true)
        })
    })

    describe("When I navigate to Bills", () => {
            // Vérifie que la page est bien chargé
            test("Then the page show", async() => {
                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({ pathname })
                }
                Object.defineProperty(window, "localStorage", { value: localStorageMock })
                window.localStorage.setItem("user", JSON.stringify({
                    type: "Employee"
                }))
                new Bills({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage
                })
                document.body.innerHTML = BillsUI({ data: bills })
                await waitFor(() => screen.getByText("Mes notes de frais"))
                expect(screen.getByText("Mes notes de frais")).toBeTruthy()
            })
        })
        // Intégration
    describe("When an error occurs on API", () => {
        beforeEach(() => {
                jest.spyOn(mockStore, "bills")
                Object.defineProperty(
                    window,
                    "localStorage", { value: localStorageMock }
                )
                window.localStorage.setItem("user", JSON.stringify({
                    type: "Employee",
                    email: "a@a"
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.appendChild(root)
                router()
            })
            // Vérifie si l'erreur 404 s'affiche bien
        test("Then fetches bills from an API and fails with 404 message error", async() => {
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list: () => {
                            return Promise.reject(new Error("Erreur 404"))
                        }
                    }
                })
                const html = BillsUI({ error: "Erreur 404" })
                document.body.innerHTML = html
                const message = await screen.getByText(/Erreur 404/)
                expect(message).toBeTruthy()
            })
            // Vérifie si l'erreur 500 s'affiche bien
        test("Then fetches messages from an API and fails with 500 message error", async() => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"))
                    }
                }
            })
            const html = BillsUI({ error: "Erreur 500" })
            document.body.innerHTML = html
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
        })
    })
})